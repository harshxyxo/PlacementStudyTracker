package com.placementtracker.backend.controllers;

import com.placementtracker.backend.models.Notification;
import com.placementtracker.backend.repositories.NotificationRepository;
import com.placementtracker.backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository repo;

    @GetMapping
    public List<Notification> getNotifications(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return repo.findByUserIdOrderByTimestampDesc(userDetails.getId());
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable String id) {
        Notification notification = repo.findById(id).orElseThrow();
        if (!notification.getUserId().equals(userDetails.getId())) {
            return ResponseEntity.status(403).build();
        }
        notification.setRead(true);
        repo.save(notification);
        return ResponseEntity.ok().build();
    }
}
