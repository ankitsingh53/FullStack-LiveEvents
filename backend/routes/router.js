import express from 'express';
import {Router} from 'express';
import {fetchEvent} from '../controllers/fetchEvent.js';
import { deleteEvent } from '../controllers/deleteEvent.js';
import {createEvent} from '../controllers/createEvent.js'
import {updateEvent} from '../controllers/updateEvent.js'
 
const router = Router()

router.get('/getevents', fetchEvent)

router.post('/createevents', createEvent)

router.put('/updateevents/:id',updateEvent )


router.delete('/deleteevents/:id', deleteEvent)


export {router}
