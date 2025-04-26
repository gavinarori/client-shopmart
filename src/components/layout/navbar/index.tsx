"use client"

import { useEffect } from "react"

import { useState } from "react"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { Heart, ShoppingCart, User, Lock, Search, Menu, X, ChevronDown } from "lucide-react"
import LogoSquare from "../../logo-square"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { get_card_products, get_wishlist_products } from "@/store/reducers/cardReducer"
import { CartDrawer } from "@/components/cart/cart-drawer"

export default function Header() {
  const dispatch = useDispatch()
  const router = useRouter()
  const pathname = usePathname()

  // Add a default empty array for categorys
  const { categorys  } = useSelector((state: any) => state.home || { categorys: [] })
  const { userInfo } = useSelector((state: any) => state.auth)
  const { card_product_count = 0, wishlist_count = 0 } = useSelector(
    (state: any) => state.card || { card_product_count: 0, wishlist_count: 0 },
  )

  const [searchValue, setSearchValue] = useState("")
  const [category, setCategory] = useState("")
  const [isOpen, setIsOpen] = React.useState(false)

  const search = () => {
    if (searchValue.trim()) {
      router.push(`/products/search?category=${category}&&value=${searchValue}`)
    }
  }

  const redirect_card_page = () => {
    if (userInfo) {
      router.push(`/card`)
    } else {
      router.push(`/login`)
    }
  }

  const redirect_wishlist_page = () => {
    if (userInfo) {
      router.push(`/dashboard/my-wishlist`)
    } else {
      router.push(`/login`)
    }
  }

  // Navigation items
  const navItems = [
    { title: "Home", path: "/" },
    { title: "Shop", path: "/shops" },
    { title: "Products", path: "/products" },
  ]

  useEffect(() => {
    if (userInfo) {
      dispatch(get_card_products(userInfo.id) as any)
      dispatch(get_wishlist_products(userInfo.id) as any)
    }
  }, [userInfo, dispatch])

  return (
    <header className="w-full bg-background border-b">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
          <Link href="/" className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6">
            <LogoSquare />
            <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">ShopMart</div>
          </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.title}
                href={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.path ? "text-primary font-semibold" : "text-foreground",
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4 bg-background">
            {/* Search Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" aria-label="Search">
                  <Search className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full sm:max-w-2xl mx-auto">
                <SheetHeader className="mb-4">
                  <SheetTitle>Search Products</SheetTitle>
                </SheetHeader>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <select
                      onChange={(e) => setCategory(e.target.value)}
                      className="h-10 w-full rounded-l-md border border-input bg-background px-3 py-2 text-sm outline-none appearance-none pr-8"
                    >
                      <option value="">All Categories</option>
                      {Array.isArray(categorys) &&
                        categorys.map((c, i) => (
                          <option key={i} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 opacity-50 pointer-events-none" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search products..."
                    className="flex-1"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && search()}
                  />
                  <Button onClick={search}>Search</Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="relative bg-background"
              onClick={redirect_wishlist_page}
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlist_count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {wishlist_count}
                </span>
              )}
            </Button>

            {/* Cart */}
            <CartDrawer>
            <Button variant="ghost" size="icon" className="relative" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {card_product_count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {card_product_count}
                </span>
              )}
            </Button>
            </CartDrawer>
            

            {/* User Menu */}
            {userInfo ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline-block">{userInfo.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/my-wishlist">My Wishlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/orders">My Orders</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" asChild>
                <Link href="/login" className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  <span className="hidden sm:inline-block">Login</span>
                </Link>
              </Button>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center space-x-4 md:hidden">
          <CartDrawer>
            <Button variant="ghost" size="icon" className="relative" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {card_product_count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {card_product_count}
                </span>
              )}
            </Button>
            </CartDrawer>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-4">
                      <Link href="/" onClick={() => setIsOpen(false)}>
                      <LogoSquare />
                      <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">ShopMart</div>
                      </Link>
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon">
                          <X className="h-5 w-5" />
                          <span className="sr-only">Close</span>
                        </Button>
                      </SheetClose>
                    </div>

                    {/* Mobile Search */}
                    <div className="relative flex items-center mb-4">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        className="pr-10"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            search()
                            setIsOpen(false)
                          }
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0"
                        onClick={() => {
                          search()
                          setIsOpen(false)
                        }}
                      >
                        <Search className="h-4 w-4" />
                        <span className="sr-only">Search</span>
                      </Button>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="flex-1 overflow-auto py-4">
                    <nav className="flex flex-col space-y-1 px-4">
                      {navItems.map((item) => (
                        <Link
                          key={item.title}
                          href={item.path}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center py-3 px-2 rounded-md text-sm font-medium transition-colors",
                            pathname === item.path ? "bg-primary/10 text-primary" : "hover:bg-muted",
                          )}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </nav>
                  </div>

                  {/* Mobile User Actions */}
                  <div className="border-t p-4">
                    <div className="flex flex-col space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          redirect_wishlist_page()
                          setIsOpen(false)
                        }}
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        Wishlist
                        {wishlist_count > 0 && (
                          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            {wishlist_count}
                          </span>
                        )}
                      </Button>

                      {userInfo ? (
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => {
                            router.push("/dashboard")
                            setIsOpen(false)
                          }}
                        >
                          <User className="mr-2 h-4 w-4" />
                          {userInfo.name}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => {
                            router.push("/login")
                            setIsOpen(false)
                          }}
                        >
                          <Lock className="mr-2 h-4 w-4" />
                          Login
                        </Button>
                      )}

                      <ThemeToggle  />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

      </div>
    </header>
  )
}
