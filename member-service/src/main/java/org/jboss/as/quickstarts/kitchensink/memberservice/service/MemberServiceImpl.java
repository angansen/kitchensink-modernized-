package org.jboss.as.quickstarts.kitchensink.memberservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jboss.as.quickstarts.kitchensink.memberservice.exception.ResourceNotFoundException;
import org.jboss.as.quickstarts.kitchensink.memberservice.model.Member;
import org.jboss.as.quickstarts.kitchensink.memberservice.model.MemberDTO;
import org.jboss.as.quickstarts.kitchensink.memberservice.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberServiceImpl implements MemberService {
    
    private final MemberRepository memberRepository;
    
    @Override
    public List<MemberDTO> findAll() {
        log.info("Finding all members");
        return memberRepository.findAllByOrderByNameAsc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<MemberDTO> findById(String id) {
        log.info("Finding member by id: {}", id);
        return memberRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    @Override
    public Optional<MemberDTO> findByEmail(String email) {
        log.info("Finding member by email: {}", email);
        return memberRepository.findByEmail(email)
                .map(this::convertToDTO);
    }
    
    @Override
    public MemberDTO createMember(MemberDTO memberDTO) {
        log.info("Creating new member with email: {}", memberDTO.getEmail());
        
        if (emailExists(memberDTO.getEmail())) {
            log.error("Email already exists: {}", memberDTO.getEmail());
            throw new IllegalArgumentException("Email already exists: " + memberDTO.getEmail());
        }
        
        Member member = convertToEntity(memberDTO);
        member.setCreatedAt(LocalDateTime.now());
        member.setUpdatedAt(LocalDateTime.now());
        
        Member savedMember = memberRepository.save(member);
        log.info("Member created with id: {}", savedMember.getId());
        
        return convertToDTO(savedMember);
    }
    
    @Override
    public MemberDTO updateMember(String id, MemberDTO memberDTO) {
        log.info("Updating member with id: {}", id);
        
        Member existingMember = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));
        
        // Check if email is being changed and if it already exists
        if (!existingMember.getEmail().equals(memberDTO.getEmail()) && 
                emailExists(memberDTO.getEmail())) {
            log.error("Cannot update member. Email already exists: {}", memberDTO.getEmail());
            throw new IllegalArgumentException("Email already exists: " + memberDTO.getEmail());
        }
        
        existingMember.setName(memberDTO.getName());
        existingMember.setEmail(memberDTO.getEmail());
        existingMember.setPhoneNumber(memberDTO.getPhoneNumber());
        existingMember.setActive(memberDTO.isActive());
        existingMember.setUpdatedAt(LocalDateTime.now());
        
        Member updatedMember = memberRepository.save(existingMember);
        log.info("Member updated: {}", updatedMember.getId());
        
        return convertToDTO(updatedMember);
    }
    
    @Override
    public void deleteMember(String id) {
        log.info("Deleting member with id: {}", id);
        
        if (!memberRepository.existsById(id)) {
            log.error("Cannot delete. Member not found with id: {}", id);
            throw new ResourceNotFoundException("Member not found with id: " + id);
        }
        
        memberRepository.deleteById(id);
        log.info("Member deleted with id: {}", id);
    }
    
    @Override
    public boolean emailExists(String email) {
        return memberRepository.existsByEmail(email);
    }
    
    private MemberDTO convertToDTO(Member member) {
        MemberDTO dto = new MemberDTO();
        dto.setId(member.getId());
        dto.setName(member.getName());
        dto.setEmail(member.getEmail());
        dto.setPhoneNumber(member.getPhoneNumber());
        dto.setActive(member.isActive());
        return dto;
    }
    
    private Member convertToEntity(MemberDTO dto) {
        Member member = new Member();
        member.setName(dto.getName());
        member.setEmail(dto.getEmail());
        member.setPhoneNumber(dto.getPhoneNumber());
        member.setActive(dto.isActive());
        return member;
    }
}
