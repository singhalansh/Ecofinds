import { cn } from "@/lib/utils"

export function Spinner({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent",
        className
      )}
      role="status"
      aria-label="Loading..."
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}
