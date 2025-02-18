# guide to interfaces

## send_user_info

placeholder name for now, the idea is that the send_user_info will take the users preference and [send](./send_user_info/send/interface.ts) the data from the frontend to the backend, where as [receive](./send_user_info/receive/interface.ts) is what the front end will receive once the backend is done

## send_images

inherits all of the data from send_user_info so that we can have all of the methods be independent of one another
