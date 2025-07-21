import { formatCurrency, formatDate } from '../utils/financial';

const AmortizationTable = ({ amortization, loanData }) => {
  if (!amortization || amortization.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
        <p className="text-gray-500">No hay datos de amortización para mostrar</p>
      </div>
    );
  }

  const totals = amortization.reduce((acc, payment) => ({
    totalPayment: acc.totalPayment + payment.payment,
    totalInterest: acc.totalInterest + payment.interest,
    totalVAT: acc.totalVAT + (payment.vatOnInterest || payment.interestTax || 0),
    totalPrincipal: acc.totalPrincipal + payment.principal,
    totalCommission: acc.totalCommission + (payment.commission || 0),
    totalCommissionTax: acc.totalCommissionTax + (payment.commissionTax || 0)
  }), { 
    totalPayment: 0, 
    totalInterest: 0, 
    totalVAT: 0, 
    totalPrincipal: 0,
    totalCommission: 0,
    totalCommissionTax: 0
  });

  return (
    <div className="space-y-6">
      {/* Resumen del préstamo */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Resumen del Préstamo</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Monto Principal</p>
            <p className="text-lg font-bold text-blue-600">{formatCurrency(loanData.amount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tasa Anual</p>
            <p className="text-lg font-bold text-green-600">{loanData.rate}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Plazo</p>
            <p className="text-lg font-bold text-purple-600">{loanData.term} meses</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Cuota Mensual</p>
            <p className="text-lg font-bold text-orange-600">{formatCurrency(amortization[1]?.payment || 0)}</p>
          </div>
        </div>
      </div>

      {/* Totales */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Totales del Préstamo</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total a Pagar</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(totals.totalPayment)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Intereses</p>
            <p className="text-xl font-bold text-orange-600">{formatCurrency(totals.totalInterest)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total IVA</p>
            <p className="text-xl font-bold text-red-600">{formatCurrency(totals.totalVAT)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Capital Pagado</p>
            <p className="text-xl font-bold text-blue-600">{formatCurrency(totals.totalPrincipal)}</p>
          </div>
        </div>
      </div>

      {/* Tabla de amortización */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-900">📊 Tabla de Amortización</h3>
          <p className="text-sm text-gray-600 mt-1">Desglose mensual de pagos</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pago Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capital
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interés
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IVA
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saldo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {amortization.map((payment, index) => (
                <tr key={index} className={index === 0 ? 'bg-yellow-50' : index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index === 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Inicial
                      </span>
                    ) : (
                      `Mes ${index}`
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(payment.date || payment.paymentDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    {formatCurrency(payment.payment)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600">
                    {formatCurrency(payment.principal)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-orange-600">
                    {formatCurrency(payment.interest)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                    {formatCurrency(payment.vatOnInterest || payment.interestTax || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-purple-600">
                    {formatCurrency(payment.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráfico de progreso */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Progreso del Préstamo</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Capital Pagado</span>
              <span className="font-medium">
                {formatCurrency(totals.totalPrincipal)} / {formatCurrency(loanData.amount)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(totals.totalPrincipal / loanData.amount) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Intereses Pagados</span>
              <span className="font-medium">
                {formatCurrency(totals.totalInterest)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(totals.totalInterest / totals.totalPayment) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>IVA Pagado</span>
              <span className="font-medium">
                {formatCurrency(totals.totalVAT)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-red-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(totals.totalVAT / totals.totalPayment) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Notas importantes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">📌 Notas Importantes</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• El <strong>Mes 0</strong> incluye únicamente las comisiones de apertura y su IVA</li>
          <li>• La comisión de apertura es del <strong>1.8%</strong> sobre el monto del préstamo</li>
          <li>• El <strong>IVA del 16%</strong> se aplica tanto a las comisiones como a los intereses mensuales</li>
          <li>• Los cálculos están basados en la fórmula de anualidad con estándares bancarios mexicanos</li>
          <li>• Las fechas mostradas son estimadas a partir de la fecha actual</li>
        </ul>
      </div>
    </div>
  );
};

export default AmortizationTable;
