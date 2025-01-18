import { memo, useCallback, useEffect, useState } from 'react'
import { Slider } from "@/components/ui/slider"




export type ImageBlockWidthProps = {
  onChange: (value: number) => void
  value: number
}

export const ImageBlockWidth = memo(({ onChange, value }: ImageBlockWidthProps) => {
  const [currentValue, setCurrentValue] = useState([value])

  useEffect(() => {
    setCurrentValue([value])
  }, [value])

  const handleChange = useCallback(
    (value: number[]) => {


      const nextValue = value[0]
      onChange(nextValue)
      setCurrentValue([nextValue])
    },
    [onChange],
  )

  return (
    <div className="flex items-center gap-2 min-w-40">

      <Slider value={currentValue} min={25} max={100} step={10} onValueChange={handleChange} />
      <span className="text-xs font-semibold text-neutral-500 select-none">{value}%</span>
    </div>
  )
})

ImageBlockWidth.displayName = 'ImageBlockWidth'
