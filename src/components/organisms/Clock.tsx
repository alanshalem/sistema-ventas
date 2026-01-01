import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Device } from '../../styles/breakpoints'

export function Clock() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    const showClock = () => {
      const currentDate = new Date()
      const currentHour = currentDate.getHours()
      const currentMinutes = currentDate.getMinutes()
      const currentSeconds = currentDate.getSeconds()
      const currentMonth = currentDate.getMonth()
      const currentDay = currentDate.getDate()
      const currentYear = currentDate.getFullYear()

      const days = [
        'domingo',
        'lunes',
        'martes',
        'miércoles',
        'jueves',
        'viernes',
        'sábado',
      ]
      const months = [
        'enero',
        'febrero',
        'marzo',
        'abril',
        'mayo',
        'junio',
        'julio',
        'agosto',
        'septiembre',
        'octubre',
        'noviembre',
        'diciembre',
      ]

      const month = months[currentMonth]
      const hr = currentHour > 12 ? currentHour - 12 : currentHour
      const am = currentHour < 12 ? 'AM' : 'PM'

      const formattedMinutes = currentMinutes < 10 ? '0' + currentMinutes : currentMinutes
      const formattedSeconds = currentSeconds < 10 ? '0' + currentSeconds : currentSeconds

      setTime(`${hr}:${formattedMinutes}:${formattedSeconds}:${am}`)
      setDate(`${days[currentDate.getDay()]} ${currentDay} ${month} del ${currentYear}`)
    }

    const intervalId = setInterval(showClock, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <Container>
      <div className="cont-reloj">
        <div className="reloj" id="reloj">
          {<Icon icon="icon-park:alarm-clock" />} {time}
        </div>
        <div className="datos">
          <span id="fec_Datos">{date}</span>
        </div>
      </div>
    </Container>
  )
}

const Container = styled.div`
  .cont-reloj {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    font-weight: bold;
    gap: 10px;
    margin-top: 8px;
    @media ${Device.laptop} {
      margin-top: 0;
    }
  }
  .reloj {
    font-size: 1em;
    align-items: center;
    display: flex;
    gap: 5px;
  }
  .datos {
    font-size: 1em;
  }
`
