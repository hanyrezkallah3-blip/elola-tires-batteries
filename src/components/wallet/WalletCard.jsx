export default function WalletCard({ wallet }) {

  return (

    <div className="bg-slate-900 p-6 rounded-3xl border border-slate-700">

      <h2 className="text-2xl font-black">
        {wallet.customerName}
      </h2>

      <p className="text-gray-400">
        {wallet.phone}
      </p>

      <div className="text-green-400 text-3xl font-black mt-4">
        {wallet.balance}
      </div>

    </div>

  )

}