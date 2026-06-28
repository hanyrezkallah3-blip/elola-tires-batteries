export default function WalletTransactionCard({ tx }) {

  return (

    <div className="bg-slate-800 p-4 rounded-2xl mb-3 flex justify-between">

      <div>

        <div className="font-black text-white">
          {tx.customerName}
        </div>

        <div className="text-gray-400 text-sm">
          {tx.reason}
        </div>

      </div>

      <div className={`font-black ${
        tx.amount > 0 ? 'text-green-400' : 'text-red-400'
      }`}>

        {tx.amount}

      </div>

    </div>

  )

}