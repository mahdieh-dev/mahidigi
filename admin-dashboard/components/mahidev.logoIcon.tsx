"use client"

import { useId } from "react"

type MahiDevLogoIconProps = {
    size?: number
    className?: string
}

export function MahiDevLogoIcon({
    size = 64,
    className,
}: MahiDevLogoIconProps) {
    const gradientId = useId()

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 768 768"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="MahiDev logo"
            className={className}
        >
            <defs>
                <linearGradient
                    id={gradientId}
                    x1="369"
                    y1="190"
                    x2="369"
                    y2="600"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0%" stopColor="#0077ff" />
                    <stop offset="48%" stopColor="#2454ff" />
                    <stop offset="100%" stopColor="#6a00ff" />
                </linearGradient>
            </defs>

            <path
                d="M30 304 L225 185 L225 258 L94 341 L94 397 L225 480 L225 527 L30 398 Z"
                fill="currentColor"
            />

            <path
                d="M250 190 L398 349 L488 263 L488 548 L436 590 L436 394 L393 433 L303 337 L303 600 L250 570 Z"
                fill={`url(#${gradientId})`}
            />

            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M513 181 L708 298 L708 414 L513 529 Z M574 287 L644 329 L644 380 L574 422 Z"
                fill="currentColor"
            />
        </svg>
    )
}