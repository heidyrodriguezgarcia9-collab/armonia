import { useAppStore } from '../../store/useAppStore'
import { Wallet, TrendingDown, CheckCircle2, AlertTriangle, Download } from 'lucide-react'
import { ProgressBar } from '../ui/ProgressBar'
import { TaskCard } from '../tasks/TaskCard'
import { Cell, PieChart, Pie, ResponsiveContainer, Tooltip } from 'recharts'
import { generateICS, downloadICS } from '../../utils/ics'

const CHART_COLORS = ['#10b981', '#ec4899', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#14b8a6', '#f97316']

export function Finances() {
  const { activeMonth, tasks, categories, getMonthlyExpenses } = useAppStore()
  const expenses = getMonthlyExpenses()

  const monthName = new Date(activeMonth + '-01T12:00:00').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })

  const financeTasks = tasks.filter((t) => {
    const cat = categories.find((c) => c.id === t.categoryId)
    return cat?.id === 'finance' && t.date.startsWith(activeMonth.substring(0, 7))
  }).sort((a, b) => a.date.localeCompare(b.date))

  const chartData = Object.entries(expenses.byCategory).map(([name, value]) => ({ name, value }))

  const savingsRate = expenses.total > 0 ? Math.round((expenses.paid / expenses.total) * 100) : 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Finanzas</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{monthName}</p>
        </div>
        <button
          onClick={() => {
            const ics = generateICS(financeTasks, categories, `Finanzas-${monthName}`)
            downloadICS(ics, `armonia-finanzas-${activeMonth.substring(0, 7)}.ics`)
          }}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-1"
          title="Exportar pagos al calendario"
        >
          <Download className="w-3.5 h-3.5" />
          Exportar
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">${expenses.total.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Planificado</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-green-600">${expenses.paid.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Pagado</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-amber-600">${expenses.unpaid.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Pendiente</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{savingsRate}%</p>
              <p className="text-xs text-gray-500">Pagado</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Progreso de pagos</h3>
          <span className="text-xs text-gray-400">{savingsRate}%</span>
        </div>
        <ProgressBar value={savingsRate} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Gastos por categoría</h3>
          {chartData.length === 0 ? (
            <div className="text-center py-8">
              <Wallet className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-sm text-gray-400">Sin datos financieros este mes</p>
            </div>
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      fontSize: '12px',
                    }}
                    formatter={(value: any) => [`$${Number(value).toFixed(2)}`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          {chartData.length > 0 && (
            <div className="space-y-1.5 mt-3">
              {chartData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                  <span className="text-gray-600 dark:text-gray-400 flex-1">{item.name}</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">${item.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Pagos del mes</h3>
          <div className="space-y-2">
            {financeTasks.length === 0 ? (
              <div className="text-center py-8 bg-white dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700/50">
                <Wallet className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-sm text-gray-400">No hay pagos registrados este mes</p>
              </div>
            ) : (
              financeTasks.map((t) => <TaskCard key={t.id} task={t} />)
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
