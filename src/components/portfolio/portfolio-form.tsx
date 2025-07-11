'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'

interface Portfolio {
  id: string
  name: string
  initialValue: number
  createdAt: string
}

interface PortfolioFormProps {
  mode: 'create' | 'edit'
  portfolio?: Portfolio
  onPortfolioCreated?: () => void
  onPortfolioUpdated?: () => void
  trigger?: React.ReactNode
}

export function PortfolioForm({ mode, portfolio, onPortfolioCreated, onPortfolioUpdated, trigger }: PortfolioFormProps) {
  const [name, setName] = useState(portfolio?.name || '')
  const [initialValue, setInitialValue] = useState(portfolio?.initialValue.toString() || '')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { addToast } = useToast()

  const isEditMode = mode === 'edit'

  const showToast = (type: 'success' | 'error', message: string) => {
    addToast({
      description: message,
      title: type === 'error' ? 'Error' : 'Success',
      variant: type === 'error' ? 'destructive' : 'default'
    })
  }

  const resetForm = () => {
    if (isEditMode && portfolio) {
      setName(portfolio.name)
      setInitialValue(portfolio.initialValue.toString())
    } else {
      setName('')
      setInitialValue('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !initialValue.trim()) {
      showToast('error', 'Please fill in all fields')
      return
    }

    setIsLoading(true)

    try {
      if (isEditMode) {
        // Use server action for update
        const { updatePortfolio } = await import('@/lib/actions')
        const formData = new FormData()
        formData.append('id', portfolio!.id)
        formData.append('name', name.trim())
        formData.append('initialValue', initialValue)
        
        await updatePortfolio(formData)
        showToast('success', 'Portfolio updated successfully!')
        setIsOpen(false)
        onPortfolioUpdated?.()
      } else {
        // Use server action for create
        const { createPortfolio } = await import('@/lib/actions')
        const formData = new FormData()
        formData.append('name', name.trim())
        formData.append('initialValue', initialValue)
        
        await createPortfolio(formData)
        showToast('success', 'Portfolio created successfully!')
        resetForm()
        onPortfolioCreated?.()
      }
    } catch (error) {
      showToast('error', `Failed to ${isEditMode ? 'update' : 'create'} portfolio`)
    } finally {
      setIsLoading(false)
    }
  }

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Portfolio Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="e.g., My Growth Portfolio"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="initialValue">Initial Value ($)</Label>
        <Input
          id="initialValue"
          type="number"
          step="0.01"
          min="0"
          placeholder="10000.00"
          value={initialValue}
          onChange={(e) => setInitialValue(e.target.value)}
          required
        />
      </div>
      {isEditMode ? (
        <div className="flex space-x-2">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Portfolio'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Portfolio'}
        </Button>
      )}
    </form>
  )

  if (isEditMode) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          resetForm()
        }
      }}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Portfolio</DialogTitle>
            <DialogDescription>
              Update your portfolio details
            </DialogDescription>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create New Portfolio</CardTitle>
        <CardDescription>
          Add a new portfolio to track your investments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  )
} 