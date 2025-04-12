"use client"

import { useCart } from "./add-to-cart"
import { Button } from "@/components/ui/button"
import { CartDrawer } from "./cart-drawer"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export function CartCount() {
  const { count } = useCart()

  return (
    <CartDrawer>
      <Button variant="ghost" size="icon" className="relative">
        <Icons.cart className="h-5 w-5" />
        <AnimatePresence>
          {count > 0 && (
            <motion.span
              key="cart-count"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className={cn(
                "absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground",
                count > 99 ? "text-[10px]" : "",
              )}
            >
              {count > 99 ? "99+" : count}
            </motion.span>
          )}
        </AnimatePresence>
        <span className="sr-only">Cart ({count} items)</span>
      </Button>
    </CartDrawer>
  )
}
