import fs from 'fs'
import { utilService } from './util.service.js'


export const toyService = {
    query,
    getById,
    remove,
    save
}

const toys = utilService.readJsonFile('data/toy.json')

function query(filterBy = {}) {
    console.log(filterBy)
    let filteredToys = toys
    if (filterBy.name) {
        const regExp = new RegExp(filterBy.name, 'i')
        filteredToys = filteredToys.filter(toy => regExp.test(toy.name))
    }
    if (filterBy.stock) {
        if (filterBy.stock === 'All') {
            filteredToys = filteredToys
        }
        if (filterBy.stock === 'outOfStock') {
            filteredToys = filteredToys.filter(toy => toy.inStock === false)
        }
        if (filterBy.stock === 'inStock') {
            console.log(filteredToys)
            filteredToys = filteredToys.filter(toy => toy.inStock === true)
        }
    }
    if (filterBy.sortBy) {
        if (filterBy.sortBy === 'name') {
            filteredToys = filteredToys.sort((a, b) => a.name.localeCompare(b.name));
            console.log(filteredToys)
        } else if (filterBy.sortBy === 'price') {
            filteredToys = filteredToys.sort((a, b) => a.price - b.price);
        }
        else if (filterBy.sortBy === 'created') {
            filteredToys = filteredToys.sort((a, b) => a.createdAt - b.createdAt);
        }
    }
    /* if (pageIdx !== undefined) {
      let startIdx = pageIdx * PAGE_SIZE
      filteredToys = filteredToys.slice(startIdx, startIdx + PAGE_SIZE)
    } */
   
    return Promise.resolve(filteredToys)/* .resolve(toysToReturn) */
}

function getById(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    return Promise.resolve(toy)
}

function remove(toyId, loggedinUser) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No Such toy')
    const toy = toys[idx]
    /* if (!loggedinUser.isAdmin &&
        toy.owner._id !== loggedinUser._id) {
        return Promise.reject('Not your toy')
    } */
    toys.splice(idx, 1)
    return _savetoysToFile()
}

function save(toy) {
    if (toy._id) {
        const toyToUpdate = toys.find(currtoy => currtoy._id === toy._id)
        /* if (!loggedinUser.isAdmin &&
            toyToUpdate.owner._id !== loggedinUser._id) {
            return Promise.reject('Not your toy')
        } */
        toyToUpdate.name = toy.name
        toyToUpdate.labael = toy.labael
        toyToUpdate.price = toy.price
        toyToUpdate.inStock = toy.inStock
        toyToUpdate._id = toy._id
        toy = toyToUpdate

    } else {
        toy._id = utilService.makeId()
        toys.push(toy)
    }

    return _savetoysToFile().then(() => toy)
}


function _savetoysToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(toys, null, 4)
        fs.writeFile('data/toy.json', data, (err) => {
            if (err) {
                loggerService.error('Cannot write to toys file', err)
                return reject(err)
            }
            resolve()
        })
    })
}
