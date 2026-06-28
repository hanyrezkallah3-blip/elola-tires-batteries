import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWebsiteStore } from '../store/websiteStore'

import WalletStats from '../components/wallet/WalletStats'
import WalletSearch from '../components/wallet/WalletSearch'
import WalletUserCard from '../components/wallet/WalletUserCard'
import WalletTransactions from '../components/wallet/WalletTransactions'
import WalletAddBalance from '../components/wallet/WalletAddBalance'
import CashbackSettings from '../components/wallet/CashbackSettings'

export default function Wallets() {

  const navigate = useNavigate()

  // ================= STORE =================

  const wallets = useWebsiteStore((s) => s.wallets || [])
  const walletTransactions = useWebsiteStore((s) => s.walletTransactions || [])
  const cashbackPercentage = useWebsiteStore((s) => s.cashbackPercentage || 0)
  const setCashbackPercentage = useWebsiteStore((s) => s.setCashbackPercentage)

  const addWalletBalance = useWebsiteStore((s) => s.addWalletBalance)
  const deductWalletBalance = useWebsiteStore((s) => s.deductWalletBalance)
  const deleteWallet = useWebsiteStore((s) => s.deleteWallet)

  const walletEnabled = useWebsiteStore((s) => s.walletEnabled ?? true)
  const setWalletEnabled = useWebsiteStore((s) => s.setWalletEnabled)

  // ================= STATE =================

  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedBalanceCustomer, setSelectedBalanceCustomer] = useState(null)
  const [operationType, setOperationType] = useState('add')

  // ================= FILTER =================

  const filteredWallets = useMemo(() => {
    if (!search.trim()) return wallets

    return wallets.filter((w) =>
      w.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      w.phone?.includes(search)
    )
  }, [wallets, search])

  // ================= STATS =================

  const totalWalletBalance = useMemo(() =>
    wallets.reduce((acc, w) => acc + Number(w.balance || 0), 0)
  , [wallets])

  const totalCashback = useMemo(() =>
    wallets.reduce((acc, w) => acc + Number(w.totalCashback || 0), 0)
  , [wallets])

  const customersWithBalance = useMemo(() =>
    wallets.filter((w) => Number(w.balance || 0) > 0).length
  , [wallets])

  const totalTransactions = walletTransactions.length

  const highestWallet = useMemo(() => {
    if (!wallets.length) return null
    return [...wallets].sort((a, b) =>
      Number(b.balance || 0) - Number(a.balance || 0)
    )[0]
  }, [wallets])

  // ================= HANDLERS =================

  const handleAdd = (customer) => {
    setSelectedBalanceCustomer(customer)
    setOperationType('add')
  }

  const handleDeduct = (customer) => {
    setSelectedBalanceCustomer(customer)
    setOperationType('deduct')
  }

  const handleSubmit = (data) => {
    if (!selectedBalanceCustomer) return

    const amount = Number(data.amount || 0)
    if (amount <= 0) return

    if (operationType === 'add') {
      addWalletBalance({
        phone: selectedBalanceCustomer.phone,
        customerName: selectedBalanceCustomer.customerName,
        amount,
        reason: data.reason || 'إضافة رصيد'
      })
    } else {
      deductWalletBalance({
        phone: selectedBalanceCustomer.phone,
        customerName: selectedBalanceCustomer.customerName,
        amount,
        reason: data.reason || 'خصم رصيد'
      })
    }

    setSelectedBalanceCustomer(null)
  }

  const handleDelete = (wallet) => {
    if (window.confirm(`حذف ${wallet.customerName}؟`)) {
      deleteWallet(wallet.phone)
    }
  }

  const handleExport = () => {
    const blob = new Blob(
      [JSON.stringify(wallets, null, 2)],
      { type: 'application/json' }
    )

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = url
    a.download = 'wallets.json'
    a.click()

    URL.revokeObjectURL(url)
  }

  // ================= UI =================

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-10">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-[40px] p-10 mb-10">
        <h1 className="text-5xl font-black text-black mb-2">
          💳 المحافظ
        </h1>

        <p className="text-black/70 text-xl font-bold">
          نظام إدارة المحافظ والكاش باك
        </p>
      </div>

      {/* STATS */}
      <WalletStats
        totalWalletBalance={totalWalletBalance}
        totalCashback={totalCashback}
        totalTransactions={totalTransactions}
        customersWithBalance={customersWithBalance}
      />

      {/* SETTINGS */}
      <CashbackSettings
        cashbackPercentage={cashbackPercentage}
        setCashbackPercentage={setCashbackPercentage}
        walletEnabled={walletEnabled}
        setWalletEnabled={setWalletEnabled}
      />

      {/* SEARCH */}
      <WalletSearch
        search={search}
        setSearch={setSearch}
      />

      {/* LIST */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-10">

        {filteredWallets.map((wallet) => (
          <div key={wallet.phone} className="relative">

            <button
              onClick={() => handleDelete(wallet)}
              className="absolute top-3 left-3 bg-red-600 w-10 h-10 rounded-full"
            >
              ✖
            </button>

            <WalletUserCard
              customer={wallet}
              onAddBalance={() => handleAdd(wallet)}
              onDeductBalance={() => handleDeduct(wallet)}
              onOpenTransactions={() => setSelectedCustomer(wallet)}
            />

          </div>
        ))}

      </div>

      {/* EMPTY */}
      {filteredWallets.length === 0 && (
        <div className="text-center text-3xl text-gray-500 mt-20">
          لا توجد محافظ
        </div>
      )}

      {/* MODALS */}
      {selectedCustomer && (
        <WalletTransactions
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}

      {selectedBalanceCustomer && (
        <WalletAddBalance
          customer={selectedBalanceCustomer}
          onClose={() => setSelectedBalanceCustomer(null)}
          onSubmit={handleSubmit}
        />
      )}

    </div>
  )
}