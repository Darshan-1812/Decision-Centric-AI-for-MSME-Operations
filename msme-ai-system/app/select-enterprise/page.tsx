"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ENTERPRISE_CONFIGS, EnterpriseType } from "@/lib/types"
import { Building2, ArrowRight, CheckCircle2 } from "lucide-react"
import { useState } from "react"

export default function EnterpriseSelector() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'micro' | 'small' | 'medium'>('all')

  const categories = [
    { id: 'all' as const, name: 'All Types', description: 'View all enterprise types' },
    { id: 'micro' as const, name: 'Micro Enterprises', description: 'Kirana stores, grocery shops' },
    { id: 'small' as const, name: 'Small Enterprises', description: 'Restaurants, cafés, service startups' },
    { id: 'medium' as const, name: 'Medium Enterprises', description: 'Factories, logistics, processing units' },
  ]

  const filteredEnterprises = Object.values(ENTERPRISE_CONFIGS).filter(
    config => selectedCategory === 'all' || config.category === selectedCategory
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">MSME Operations Hub</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/staff">
              <Button variant="ghost">Staff View</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4">
            Choose Your Business Type
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
            Select Your Enterprise Type
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Get a customized dashboard tailored to your specific business needs
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 border-b">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="h-auto flex-col items-start py-3 px-4"
              >
                <span className="font-semibold">{category.name}</span>
                <span className="text-xs opacity-80">{category.description}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Cards */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEnterprises.map((config) => (
              <Card 
                key={config.type} 
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-3xl">
                      {config.icon}
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {config.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{config.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {config.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-muted-foreground">
                        Key Features:
                      </h4>
                      <ul className="space-y-1.5">
                        {config.features.slice(0, 4).map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-muted-foreground">
                        Dashboard Modules:
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {config.dashboardModules.map((module) => (
                          <Badge 
                            key={module} 
                            variant="outline" 
                            className="text-xs capitalize"
                          >
                            {module}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Link href={`/dashboard?type=${config.type}`} className="block">
                      <Button 
                        className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground" 
                        variant="outline"
                      >
                        Open Dashboard
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-2xl text-center">
          <h3 className="text-2xl font-bold mb-4">Not sure which type?</h3>
          <p className="text-muted-foreground mb-6">
            Start with a general dashboard and customize it later based on your needs
          </p>
          <Link href="/dashboard">
            <Button size="lg">
              Open General Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
