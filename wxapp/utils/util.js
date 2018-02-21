const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var Worker = {
  create: (myhost, sessionid) => {
    var result = null
    wx.request({
      url: myhost + 'worker/workers/',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'WXSESSION': sessionid
      },
      success: res => {
        if (res.statusCode == 201) {
          result = res.data
        }
        if (this.createCallback) {
          this.createCallback(result)
        }
        return result
      }
    })
  },
}

module.exports = {
  formatTime: formatTime,
  Worker: Worker,
}
