package com.pravin.chatapplication.Repository;

import com.pravin.chatapplication.entities.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoomRepository  extends MongoRepository<Room, String> {

    Room findByRoomId(String roomId);
}
