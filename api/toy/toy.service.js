import { ObjectId } from 'mongodb'

import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger,service.js'
import { utilService } from '../../services/util.service.js'

export const toyService = {
	remove,
	query,
	getById,
	add,
	update,
	addToyMsg,
	removeToyMsg,
}

async function query(filterBy = { txt: '' }) {
    console.log(filterBy)
	try {
		const criteria = _buildCriteria(filterBy)
		const collection = await dbService.getCollection('toy')
		var toys = await collection.find(criteria).toArray()
		return toys
	} catch (err) {
		loggerService.error('cannot find toys', err)
		throw err
	}
}

async function getById(toyId) {
	try {
		const collection = await dbService.getCollection('toy')
		const toy = await collection.findOne({ _id: ObjectId.createFromHexString(toyId) })
		toy.createdAt = toy._id.getTimestamp()
		return toy
	} catch (err) {
		loggerService.error(`while finding toy ${toyId}`, err)
		throw err
	}
}

async function remove(toyId) {
	try {
		const collection = await dbService.getCollection('toy')
		const { deletedCount } = await collection.deleteOne({ _id: ObjectId.createFromHexString(toyId) })
        return deletedCount
	} catch (err) {
		loggerService.error(`cannot remove toy ${toyId}`, err)
		throw err
	}
}

async function add(toy) {
	try {
		const collection = await dbService.getCollection('toy')
		await collection.insertOne(toy)
		return toy
	} catch (err) {
		loggerService.error('cannot insert toy', err)
		throw err
	}
}

async function update(toy) {
    console.log(toy)
	try {
		const toyToSave = {
			name: toy.name,
			price: toy.price,
		}
		const collection = await dbService.getCollection('toy')
		await collection.updateOne({ _id: ObjectId.createFromHexString(toy._id) }, { $set: toyToSave })
        console.log(toy)
		return toy
	} catch (err) {
		loggerService.error(`cannot update toy ${toyId}`, err)
		throw err
	}
}

async function addToyMsg(toyId, msg) {
	try {
		msg.id = utilService.makeId()

		const collection = await dbService.getCollection('toy')
		await collection.updateOne({ _id: ObjectId.createFromHexString(toyId) }, { $push: { msgs: msg }})
		return msg
	} catch (err) {
		loggerService.error(`cannot add toy msg ${toyId}`, err)
		throw err
	}
}

async function removeToyMsg(toyId, msgId) {
	try {
		const collection = await dbService.getCollection('toy')
		await collection.updateOne({ _id: ObjectId.createFromHexString(toyId) }, { $pull: { msgs: { id: msgId }}})
		return msgId
	} catch (err) {
		loggerService.error(`cannot add toy msg ${toyId}`, err)
		throw err
	}
}
function _buildCriteria(filterBy) {
    const { labels, name, stock } = filterBy
  
    const criteria = {}
  
    if (name) {
      criteria.name = { $regex: name, $options: "i" }
    }
  
    if (labels && labels.length) {
      criteria.labels = { $in: labels }
    }
  
   /*  if (stock) {
      criteria.inStock = {}
    } */
  
    return criteria
  }