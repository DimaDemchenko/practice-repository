type InputCheckBoxProps = {
  isChecked: boolean
  onChange: () => void
  labelText: string
}

export const InputCheckBox = ({
  isChecked,
  onChange,
  labelText,
}: InputCheckBoxProps) => {
  return (
    <div className="check-box">
      <input type="checkbox" checked={isChecked} onChange={onChange} />
      <label>{labelText}</label>
    </div>
  )
}
