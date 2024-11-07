// src/types/style.d.ts
declare module 'tailwind-merge' {
    const twMerge: (...classes: string[]) => string
    export { twMerge }
  }