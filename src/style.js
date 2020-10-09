export default theme => ({
  content_wrap: {
    maxWidth: '1440px',
    margin: '2em auto'
  },
  privkey_grid: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    marginBottom: theme.spacing(2)
  },
  fields: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridGap: theme.spacing(2),
    padding: theme.spacing(2),
    boxSizing: 'border-box',
    width: '100%'
  },
  field: {
    display: 'grid',
    gridTemplateColumns: '4em 1fr auto',
    gridGap: theme.spacing(1),
    placeItems: 'center',
    margin: theme.spacing(1)
  },
  broadcast_wrap: {
    marginTop: theme.spacing(2)
  }
})
