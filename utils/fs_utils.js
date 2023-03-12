const fs = require('fs/promises')
const { generateId } = require('./crypto_utils')
module.exports = {
  async createImageFile(uri) {
    try {
      const match = uri.split(';')
      const ext = match[0].split('/')[1]
      const data = match[1].split(',')[1]
      const fileName = generateId(10) + `.${ext}`
      fs.writeFile(`./static/images/${fileName}`, Buffer.from(data, 'base64'))
      return fileName
    } catch (e) {
      console.log(e.message)
    }
  },
  async deleteImageFile(filePath) {
    try {
      await fs.unlink(filePath)
      return { isDeleted: true }
    } catch (e) {
      if (e && e.code === 'ENOENT') {
        return { isDeleted: false, message: "File doesn't exists" }
      }
    }
  },
}
