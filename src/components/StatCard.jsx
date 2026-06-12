export default function StatCard({ icon, label, value, color }) {
  const colors = {
    indigo: 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700',
    green:  'bg-green-50  dark:bg-green-900/30  border-green-200  dark:border-green-700',
    orange: 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700',
    purple: 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700',
  }
  const iconColors = {
    indigo: 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300',
    green:  'bg-green-100  dark:bg-green-800  text-green-600  dark:text-green-300',
    orange: 'bg-orange-100 dark:bg-orange-800 text-orange-600 dark:text-orange-300',
    purple: 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300',
  }
  return (
    <div className={`rounded-2xl border p-6 flex items-center gap-4 shadow-sm ${colors[color]}`}>
      <div className={`text-3xl w-14 h-14 flex items-center justify-center rounded-xl ${iconColors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
      </div>
    </div>
  )
}
