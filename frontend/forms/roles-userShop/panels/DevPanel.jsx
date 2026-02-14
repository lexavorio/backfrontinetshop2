import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './Panels.module.css'
import shop from '../../../App-main/internet-shop/App-shop.module.css'
import { fetchUsersList } from '../../../actions'
import { api } from '../../../components/components-internetShop/axios-shopUser'

export const DevPanel = () => {
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

  const unPunish = type =>
    api.post(`/users/unpunish/${menu.user.id}`, {
      type
    })

  const changeRole = role =>
    api.patch(`/users/role/${menu.user.id}`, {
      role
    })

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>🧑‍💻 Developer Panel</h2>

      {users.map(u => (
        <div
          key={u.id}
          className={styles.userRow}
          onClick={e => openMenu(e, u)}
        >
          {u.login} — {u.role}
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
            className={`${shop.shopBtn} ${shop.shopBtnDanger}`}
            onClick={() => applyPunishment('ban')}
          >
            🚫 Бан
          </button>

          <button
            className={`${shop.shopBtn} ${shop.shopBtnDark}`}
            onClick={() => applyPunishment('mute')}
          >
            🔇 Мут
          </button>

          <button className={shop.shopBtn} onClick={() => unPunish('ban')}>
            ♻ Снять бан
          </button>

          <button className={shop.shopBtn} onClick={() => unPunish('mute')}>
            ♻ Снять мут
          </button>

          <hr />

          <button onClick={() => changeRole('user')}>user</button>
          <button onClick={() => changeRole('admin')}>admin</button>
          <button onClick={() => changeRole('developer')}>developer</button>
        </div>
      )}
    </div>
  )
}