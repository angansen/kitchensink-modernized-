package org.jboss.as.quickstarts.kitchensink.memberservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jboss.as.quickstarts.kitchensink.memberservice.exception.ResourceNotFoundException;
import org.jboss.as.quickstarts.kitchensink.memberservice.model.MemberDTO;
import org.jboss.as.quickstarts.kitchensink.memberservice.service.MemberService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
@Slf4j
public class MemberController {

    private final MemberService memberService;

    @GetMapping
    public ResponseEntity<List<MemberDTO>> getAllMembers() {
        log.info("REST request to get all Members");
        return ResponseEntity.ok(memberService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MemberDTO> getMemberById(@PathVariable String id) {
        log.info("REST request to get Member by id: {}", id);
        return memberService.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<MemberDTO> getMemberByEmail(@PathVariable String email) {
        log.info("REST request to get Member by email: {}", email);
        return memberService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with email: " + email));
    }

    @PostMapping
    public ResponseEntity<MemberDTO> createMember(@Valid @RequestBody MemberDTO memberDTO) {
        log.info("REST request to create Member: {}", memberDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(memberService.createMember(memberDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MemberDTO> updateMember(@PathVariable String id, @Valid @RequestBody MemberDTO memberDTO) {
        log.info("REST request to update Member: {}", memberDTO);
        return ResponseEntity.ok(memberService.updateMember(id, memberDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable String id) {
        log.info("REST request to delete Member with id: {}", id);
        memberService.deleteMember(id);
        return ResponseEntity.noContent().build();
    }
}
