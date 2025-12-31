package com.example.InsurAI.repository;

import com.example.InsurAI.entity.PolicyPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PolicyPlanRepository extends JpaRepository<PolicyPlan, Long> {

    List<PolicyPlan> findByActiveTrue();

    long countByActiveTrue();

    @Query("select count(p) from PolicyPlan p where date(p.createdAt) = :date")
    long countByCreatedAtDate(@Param("date") LocalDate date);


    @Query("select p.category as category, count(p) as totalPolicies " +
            "from PolicyPlan p " +
            "group by p.category")
    List<Object[]> findCategoryTotals();


//    @Query("select pl.category as category, count(a) as usageCount " +
//            "from Appointment a " +
//            "join a.policyPlan pl " +
//            "group by pl.category")
//    List<Object[]> findCategoryUsageTotals();
}
