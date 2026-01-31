import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/input-group"

type InputPasswordProps = Omit<
  React.ComponentProps<typeof InputGroupInput>,
  "type"
> & {
  groupClassName?: string
}

export function InputPassword({
  className,
  groupClassName,
  ...props
}: InputPasswordProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <InputGroup className={groupClassName}>
      <InputGroupInput
        type={showPassword ? "text" : "password"}
        className={className}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex={-1}
        >
          {showPassword ?
            <EyeOff className="size-4" />
          : <Eye className="size-4" />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
