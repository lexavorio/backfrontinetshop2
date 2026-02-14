import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './Panels.module.css'
import { api } from '../../../components/components-internetShop/axios-shopUser'
import { fetchUsersList } from '../../../actions'

export const AdminPanel = () => {
  const users = useSelector(
    s => s.authUserShopState.usersList
  )
  const dispatch = useDispatch()

  const [menu, setMenu] = useState(null)
  const [time, setTime] = useState('')
  const [reason, setReason] = useState('')
  const menuRef = useRef(null)

  useEffect(() => {
    dispatch(fetchUsersList())
  }, [dispatch])

  useEffect(() => {
    const close = e => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setMenu(null)
      }
    }

    document.addEventListener('click', close)
    return () =>
      document.removeEventListener('click', close)
  }, [])

  const openMenu = (e, user) => {
    e.stopPropagation()
    setMenu({
      x: e.pageX,
      y: e.pageY,
      user
    })
    setTime('')
    setReason('')
  }

  const applyPunishment = type => {
    const until =
      time === 'permanent'
        ? 'permanent'
        : Date.now() + Number(time) * 60000

    api.post(`/users/punish/${menu.user.id}`, {
      type,
      until,
      reason
    })

    setMenu(null)
  }

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>🛡 Admin Panel</h2>

      {users
        .filter(u => u.role === 'user')
        .map(u => (
          <div
            key={u.id}
            className={styles.userRow}
            onClick={e => openMenu(e, u)}
          >
            {u.login}
          </div>
        ))}

      {menu && (
        <div
          ref={menuRef}
          className={styles.contextMenu}
          style={{ top: menu.y, left: menu.x }}
        >
          <input
            placeholder="Время (мин / permanent)"
            value={time}
            onChange={e => setTime(e.target.value)}
          />

          <textarea
            placeholder="Причина"
            value={reason}
            onChange={e => setReason(e.target.value)}
          />

          <button
            className={styles.shopBtnDanger}
            onClick={() => applyPunishment('ban')}
          >
            🚫 Бан
          </button>

          <button
            className={styles.shopBtnDark}
            onClick={() => applyPunishment('mute')}
          >
            🔇 Мут
          </button>
        </div>
      )}
    </div>
  )
}
