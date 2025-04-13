package org.jboss.as.quickstarts.kitchensink.memberservice.service;

import org.jboss.as.quickstarts.kitchensink.memberservice.model.Member;
import org.jboss.as.quickstarts.kitchensink.memberservice.model.MemberDTO;

import java.util.List;
import java.util.Optional;

public interface MemberService {
    
    List<MemberDTO> findAll();
    
    Optional<MemberDTO> findById(String id);
    
    Optional<MemberDTO> findByEmail(String email);
    
    MemberDTO createMember(MemberDTO memberDTO);
    
    MemberDTO updateMember(String id, MemberDTO memberDTO);
    
    void deleteMember(String id);
    
    boolean emailExists(String email);
}
