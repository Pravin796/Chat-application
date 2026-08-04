package com.pravin.chatapplication.controllers;

import com.pravin.chatapplication.Repository.RoomRepository;
import com.pravin.chatapplication.entities.Message;
import com.pravin.chatapplication.entities.Room;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class Roomcontroller {

    private final RoomRepository roomRepository;

    @PostMapping("/createroom")
    public ResponseEntity<?> createRoom(@RequestBody Map<String, String> roomRequest){
        String roomId = roomRequest.getOrDefault("roomId", roomRequest.get("id"));
        if(roomId == null || roomId.isBlank()){
            return ResponseEntity.badRequest().body("RoomId is required");
        }

        if(roomRepository.findByRoomId(roomId) != null){
            return ResponseEntity.badRequest().body("RoomId id already exist");
        }
        Room room = new Room();
        room.setRoomId(roomId);
        Room savedRoom = roomRepository.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
    }

    @GetMapping("/{roomid}")
    public ResponseEntity<?> joinroom(@PathVariable String roomid){
        Room room = roomRepository.findByRoomId(roomid);

        if(room == null){
            return ResponseEntity.badRequest()
                    .body("room not found");
        }

        return ResponseEntity.ok(room);
    }

    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessage(
            @PathVariable String roomId,
            @RequestParam(value = "page", defaultValue = "1", required = false) int page,
            @RequestParam(value = "size", defaultValue = "20", required = false) int size
    ){
        Room room = roomRepository.findByRoomId(roomId);
        if(room == null){
            return ResponseEntity.badRequest().build();
        }

        List<Message> messages = room.getMessages();

        int start = Math.max(0, messages.size() - (page + 1) * size);
        int end = Math.min(messages.size(), start + size);

        List<Message> paginatedMessages = messages.subList(start, end);
        return ResponseEntity.ok(paginatedMessages);
    }

}
