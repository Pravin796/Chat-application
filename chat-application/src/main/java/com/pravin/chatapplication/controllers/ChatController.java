package com.pravin.chatapplication.controllers;

import com.pravin.chatapplication.Repository.RoomRepository;
import com.pravin.chatapplication.entities.Message;
import com.pravin.chatapplication.entities.Room;
import com.pravin.chatapplication.payload.MessageRequest;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDateTime;

@Controller
@CrossOrigin("http://localhost:3000")
public class ChatController {

    private RoomRepository roomRepository;

    public ChatController(RoomRepository roomRepository){
        this.roomRepository = roomRepository;
    }

    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Message sendMessage(
            @DestinationVariable String roomId,
            @Payload MessageRequest messageRequest
            ){

        Room room = roomRepository.findByRoomId(roomId);
        if (room == null) {
            throw new RuntimeException("Room not found");
        }

        Message message = new Message();
        message.setContent(messageRequest.getContent());
        message.setSender(messageRequest.getSender());
        messageRequest.setMessageTime(LocalDateTime.now());

        if(room != null){
           room.getMessages().add(message);
           roomRepository.save(room);
        }else{
            throw new RuntimeException("Room not found !!");
        }

        return message;
    }
}
