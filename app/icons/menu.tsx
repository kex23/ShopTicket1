import * as React from "react"
import { SVGProps } from "react"
const MenuIcons = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-menu"
    {...props}
  >
    <path d="M4 12h16M4 6h16M4 18h16" />
  </svg>
)
export default MenuIcons
