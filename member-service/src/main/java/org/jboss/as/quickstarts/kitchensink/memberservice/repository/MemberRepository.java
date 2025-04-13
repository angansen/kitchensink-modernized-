package org.jboss.as.quickstarts.kitchensink.memberservice.repository;

import org.jboss.as.quickstarts.kitchensink.memberservice.model.Member;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends MongoRepository<Member, String> {
    
    Optional<Member> findByEmail(String email);
    
    List<Member> findAllByOrderByNameAsc();
    
    boolean existsByEmail(String email);
}
