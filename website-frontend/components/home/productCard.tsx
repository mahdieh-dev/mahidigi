import { Star } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"

interface Product {
    id: string
    name: string
    category: string
    image: string
    rating: number
    reviews: number
    price: number
    originalPrice: number
    discount?: number
    isBestSeller?: boolean
    isSale?: boolean
}

function IndividualProductCard({ product }: { product: Product }) {
    return (
        <div className="w-[72vw] shrink-0 sm:w-full">
            <div className="group">
                <Link href="/product" className="block">
                    <div className="relative aspect-252/316 w-full overflow-hidden bg-[#e5e5e5]">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        <div className="absolute left-2 top-2 flex gap-2">
                            {product.isBestSeller && (
                                <span className="rounded bg-[#E1B87F] px-2 py-1 text-[10px] font-semibold uppercase leading-none text-white">
                                    Bestseller
                                </span>
                            )}

                            {product.isSale && (
                                <span className="rounded bg-[#7EBFAE] px-2 py-1 text-[10px] font-semibold uppercase leading-none text-white">
                                    Sale
                                </span>
                            )}
                        </div>

                        {product.discount ? (
                            <span className="absolute bottom-2 left-2 rounded bg-[#7EBFAE] px-2 py-1 text-xs font-semibold leading-none text-white">
                                {product.discount}% OFF
                            </span>
                        ) : null}
                    </div>
                </Link>

                <div className="pt-3">
                    <p className="mb-1 text-xs uppercase tracking-wide text-gray-500">
                        {product.category}
                    </p>

                    <Link href="/product" className="block no-underline">
                        <h3 className="mb-2 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-black hover:underline">
                            {product.name}
                        </h3>
                    </Link>

                    <div className="mb-2 flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

                        <span className="ml-1 text-sm font-semibold">
                            {product.rating}
                        </span>

                        <span className="ml-2 truncate text-xs text-gray-500">
                            ({product.reviews} Reviews)
                        </span>
                    </div>

                    <div className="mb-4 flex items-center gap-2">
                        <span className="text-base font-semibold">
                            ${product.price.toFixed(2)}
                        </span>

                        <span className="text-sm text-gray-500 line-through">
                            ${product.originalPrice.toFixed(2)}
                        </span>
                    </div>

                    <Button
                        asChild
                        className="h-11 w-full rounded-md bg-black text-sm font-semibold uppercase text-white hover:bg-gray-800"
                    >
                        <Link href="/product">View Product</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default function ProductCard({
    heading,
    shop,
}: {
    heading: string
    shop?: boolean
}) {
    const products: Product[] = [
        {
            id: "1",
            name: "High-End Fragrance Collection for Males",
            category: "MEN",
            image: "https://placehold.co/252x316",
            rating: 4.7,
            reviews: 1221,
            price: 565.0,
            originalPrice: 849.0,
            discount: 34,
            isBestSeller: true,
        },
        {
            id: "2",
            name: "Chief Gentleman Deluxe Fragrance Collection",
            category: "MEN",
            image: "https://placehold.co/252x316",
            rating: 4.8,
            reviews: 736,
            price: 499.0,
            originalPrice: 899.0,
            discount: 45,
            isBestSeller: true,
        },
        {
            id: "3",
            name: "Smudge-Proof Fluid Lip Color",
            category: "WOMEN",
            image: "https://placehold.co/252x316",
            rating: 4.8,
            reviews: 187,
            price: 329.0,
            originalPrice: 449.0,
            isBestSeller: true,
            isSale: true,
        },
        {
            id: "4",
            name: "Premium Scent Gift Bundle",
            category: "WOMEN",
            image: "https://placehold.co/252x316",
            rating: 4.9,
            reviews: 732,
            price: 565.0,
            originalPrice: 849.0,
            discount: 34,
            isBestSeller: true,
        },
        {
            id: "5",
            name: "High-End Fragrance Collection for Males",
            category: "MEN",
            image: "https://placehold.co/252x316",
            rating: 4.7,
            reviews: 1221,
            price: 565.0,
            originalPrice: 849.0,
            discount: 34,
            isBestSeller: true,
        },
    ]

    return (
        <section className="container mx-auto mb-5 px-4">
            {!shop && (
                <div className="flex justify-center">
                    <div className="heading onContainer uppercase sm:my-10">
                        {heading}
                    </div>
                </div>
            )}

            <div className="flex gap-5 overflow-x-auto scroll-smooth pb-2 no-scrollbar sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
                {products.slice(0,4).map((product) => (
                    <IndividualProductCard key={product.id} product={product} />
                ))}
            </div>

            {!shop && (
                <div className="mt-8 flex justify-center">
                    <Button
                        variant="outline"
                        className="h-12 w-[90%] border-2 border-black px-4 text-sm font-semibold uppercase sm:w-[347px]"
                    >
                        View All
                    </Button>
                </div>
            )}
        </section>
    )
}