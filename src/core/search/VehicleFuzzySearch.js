// ======================================================
// EL OLA ERP
// Vehicle Fuzzy Search Engine
// ======================================================

export default class VehicleFuzzySearch {

  // ====================================================
  // NORMALIZE
  // ====================================================

  static normalize(value = '') {

    return String(value)

      .toLowerCase()

      .replace(/أ|إ|آ/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

  }

  // ====================================================
  // LEVENSHTEIN
  // ====================================================

  static levenshtein(a = '', b = '') {

    a = this.normalize(a)
    b = this.normalize(b)

    const rows = a.length + 1
    const cols = b.length + 1

    const matrix = Array.from(

      { length: rows },

      () => Array(cols).fill(0)

    )

    for (let i = 0; i < rows; i++)

      matrix[i][0] = i

    for (let j = 0; j < cols; j++)

      matrix[0][j] = j

    for (let i = 1; i < rows; i++) {

      for (let j = 1; j < cols; j++) {

        const cost =

          a[i - 1] === b[j - 1]

            ? 0

            : 1

        matrix[i][j] = Math.min(

          matrix[i - 1][j] + 1,

          matrix[i][j - 1] + 1,

          matrix[i - 1][j - 1] + cost

        )

      }

    }

    return matrix[rows - 1][cols - 1]

  }

  // ====================================================
  // SCORE
  // ====================================================

  static score(query, text) {

    query = this.normalize(query)

    text = this.normalize(text)

    if (!query || !text)

      return 0

    if (text === query)

      return 100

    if (text.startsWith(query))

      return 95

    if (text.includes(query))

      return 90

    const words = query.split(' ')

    let score = 0

    for (const word of words) {

      if (text.includes(word))

        score += 15

    }

    const distance =

      this.levenshtein(

        query,

        text

      )

    score += Math.max(

      0,

      40 - distance * 5

    )

    return Math.min(

      score,

      100

    )

  }

  // ====================================================
  // SEARCH
  // ====================================================

  static search(query, vehicles = []) {

    if (!query)

      return []

    return vehicles

      .map(vehicle => {

        const score = Math.max(

          this.score(

            query,

            vehicle.make

          ),

          this.score(

            query,

            vehicle.model

          ),

          this.score(

            query,

            `${vehicle.make} ${vehicle.model}`

          )

        )

        return {

          vehicle,

          score

        }

      })

      .filter(item =>

        item.score >= 30

      )

      .sort((a, b) => {

        if (b.score !== a.score)

          return b.score - a.score

        return String(a.vehicle.make)

          .localeCompare(

            String(b.vehicle.make)

          )

      })

      .slice(0, 20)

      .map(item =>

        item.vehicle)

  }

}