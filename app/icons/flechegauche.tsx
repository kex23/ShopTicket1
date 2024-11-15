import * as React from "react"
import { SVGProps } from "react"
const GaucheIcons = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-chevron-left"
    {...props}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
)
export default GaucheIcons
