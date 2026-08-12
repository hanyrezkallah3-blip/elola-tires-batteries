export default function SmartInput({

  label,

  value,

  onChange,

  options = [],

  placeholder = ''

}) {

  const listId = `list-${String(label || 'smart-input')
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0600-\u06FF-]/g, '')}`

  return (

    <div>

      <label className="block mb-2 font-bold">

        {label}

      </label>

      <input

        list={listId}

        value={value ?? ''}

        placeholder={placeholder}

        onChange={(e) =>

          onChange(e.target.value)

        }

        className="
          w-full
          p-4
          rounded-2xl
          bg-slate-800
          text-white
          border
          border-slate-700
          focus:border-yellow-400
          focus:outline-none
        "

      />

      <datalist id={listId}>

        {options.map((option, index) => {

          const optionName =
            option?.name ??
            option?.label ??
            option?.title ??
            option?.companyName ??
            ''

          if (!optionName) {

            return null

          }

          return (

            <option

              key={
                option?.id ??
                `${optionName}-${index}`
              }

              value={optionName}

            />

          )

        })}

      </datalist>

    </div>

  )

}