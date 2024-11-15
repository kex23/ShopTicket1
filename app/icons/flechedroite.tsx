import * as React from "react"
import { SVGProps } from "react"
const DroiteIcons = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-chevron-right"
    {...props}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
)
export default DroiteIcons
