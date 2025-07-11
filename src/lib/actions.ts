'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from './db'

export async function refreshData() {
  revalidatePath('/')
}

export async function createPortfolio(formData: FormData) {
  const name = formData.get('name') as string
  const initialValue = parseFloat(formData.get('initialValue') as string)

  if (!name || isNaN(initialValue)) {
    throw new Error('Invalid form data')
  }

  await prisma.portfolio.create({
    data: {
      name,
      initialValue
    }
  })

  revalidatePath('/')
}

export async function updatePortfolio(formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const initialValue = parseFloat(formData.get('initialValue') as string)

  if (!id || !name || isNaN(initialValue)) {
    throw new Error('Invalid form data')
  }

  await prisma.portfolio.update({
    where: { id },
    data: {
      name,
      initialValue
    }
  })

  revalidatePath('/')
}

export async function deletePortfolio(id: string) {
  await prisma.portfolio.delete({
    where: { id }
  })

  revalidatePath('/')
}

export async function createTrade(formData: FormData) {
  const ticker = formData.get('ticker') as string
  const entryPrice = parseFloat(formData.get('entryPrice') as string)
  const quantity = parseInt(formData.get('quantity') as string)
  const date = formData.get('date') as string
  const portfolioId = formData.get('portfolioId') as string

  if (!ticker || isNaN(entryPrice) || isNaN(quantity) || !date || !portfolioId) {
    throw new Error('Invalid form data')
  }

  await prisma.trade.create({
    data: {
      ticker,
      entryPrice,
      quantity,
      date: new Date(date),
      portfolioId
    }
  })

  revalidatePath('/')
}

export async function updateTrade(formData: FormData) {
  const id = formData.get('id') as string
  const ticker = formData.get('ticker') as string
  const entryPrice = parseFloat(formData.get('entryPrice') as string)
  const exitPrice = formData.get('exitPrice') ? parseFloat(formData.get('exitPrice') as string) : null
  const quantity = parseInt(formData.get('quantity') as string)
  const date = formData.get('date') as string
  const portfolioId = formData.get('portfolioId') as string

  if (!id || !ticker || isNaN(entryPrice) || isNaN(quantity) || !date || !portfolioId) {
    throw new Error('Invalid form data')
  }

  await prisma.trade.update({
    where: { id },
    data: {
      ticker,
      entryPrice,
      exitPrice,
      quantity,
      date: new Date(date),
      portfolioId
    }
  })

  revalidatePath('/')
}

export async function deleteTrade(id: string) {
  await prisma.trade.delete({
    where: { id }
  })

  revalidatePath('/')
} 