import { loggerService } from '../../services/logger,service.js'
/* import { socketService } from '../../services/socket.service.js' */
import { userService } from '../user/user.service.js'
import { authService } from '../auth/auth.service.js'
import { reviewService } from './review.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'

export async function getReviews(req, res) {
    try {
        const reviews = await reviewService.query(req.query)
        res.send(reviews)
    } catch (err) {
        loggerService.error('Cannot get reviews', err)
        res.status(400).send({ err: 'Failed to get reviews' })
    }
}

export async function deleteReview(req, res) {
    try {
        const deletedCount = await reviewService.remove(req.params.id)
        if (deletedCount === 1) {
            res.send({ msg: 'Deleted successfully' })
        } else {
            res.status(400).send({ err: 'Cannot remove review' })
        }
    } catch (err) {
        loggerService.error('Failed to delete review', err)
        res.status(400).send({ err: 'Failed to delete review' })
    }
}


export async function addReview(req, res) {
    const { loggedinUser } = asyncLocalStorage.getStore()
    try {
        var review = req.body
        review.byUserId = loggedinUser._id
        console.log(review)
        review = await reviewService.add(review)

        // prepare the updated review for sending out
        review.byUser = loggedinUser
        delete review.aboutToyId
        delete review.byUserIds
         
        res.send(review)

    } catch (err) {
        loggerService.error('Failed to add review', err)
        res.status(400).send({ err: 'Failed to add review' })
    }
}
