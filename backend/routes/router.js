import express from 'express';
import {Router} from 'express';
import {fetchEvent} from '../controllers/fetchEvent.js';
import { deleteEvent } from '../controllers/deleteEvent.js';
import {createEvent} from '../controllers/createEvent.js'
 
const router = Router()

router.get('/getevents', fetchEvent)

router.post('/createevents', createEvent)

// router.post('/updateevents',)


router.delete('/deleteevents/:id', deleteEvent)


export {router}
