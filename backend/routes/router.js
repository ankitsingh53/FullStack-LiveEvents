import express from 'express';
import {Router} from 'express';
import {fetchEvent} from '../controllers/fetchEvent.js';
import { deleteEvent } from '../controllers/deleteEvent.js';
import {createEvent} from '../controllers/createEvent.js'
import {updateEvent} from '../controllers/updateEvent.js'
import { fetchById } from '../controllers/fetchByID.js';
 
const router = Router()

router.get('/getevents', fetchEvent)

router.post('/createevents', createEvent)

router.put('/updateevents/:id',updateEvent )

router.get('/getevents/:id', fetchById)

router.delete('/deleteevents/:id', deleteEvent)


export {router}
