'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'

interface PortfolioFormProps {
  onPortfolioCreated: () => void
}

export function PortfolioForm({ onPortfolioCreated }: PortfolioFormProps) {
  const [name, setName] = useState('')
  const [initialValue, setInitialValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { addToast } = useToast()

  const showToast = (type: 'success' | 'error', message: string) => {
    addToast({
      description: message,
      title: type === 'error' ? 'Error' : 'Success',
      variant: type === 'error' ? 'destructive' : 'default'
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !initialValue.trim()) {
      showToast('error', 'Please fill in all fields')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/portfolios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          initialValue: parseFloat(initialValue),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create portfolio')
      }

      showToast('success', 'Portfolio created successfully!')
      setName('')
      setInitialValue('')
      onPortfolioCreated()
    } catch (error) {
      showToast('error', 'Failed to create portfolio')
    } finally {
      setIsLoading(false)
    }
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Portfolio'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 