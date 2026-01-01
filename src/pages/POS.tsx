import { CashRegisterOpeningScreen } from '../components/organisms/POSDesign/CashRegisterDesign/CashRegisterOpeningScreen'
import { POSTemplate, SecondarySpinner } from '../index'
import { useMostrarAperturasCajaPorUsuarioQuery } from '../tanstack/CierresCajaStack'
import { useMostrarMetodosPagoQuery } from '../tanstack/MetodosPagoStack'

export function POS() {
  const { isLoading: isLoadingMetodosPago } = useMostrarMetodosPagoQuery()
  const {
    data: dataCierreCaja,
    isLoading,
    error,
  } = useMostrarAperturasCajaPorUsuarioQuery()
  // Mostrar spinner mientras alguna de las consultas está cargando
  if (isLoading) {
    return <SecondarySpinner text="Verificando aperturas de caja" />
  }
  // Manejar errores de la consulta de cierre de caja
  if (error) {
    return <span>Error caja: {error.message}</span>
  }

  return dataCierreCaja ? <POSTemplate /> : <CashRegisterOpeningScreen />
}
