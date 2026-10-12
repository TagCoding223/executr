package com.executr;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // Enables background scheduling tasks
public class ExecutrApplication {

	public static void main(String[] args) {
		SpringApplication.run(ExecutrApplication.class, args);
	}

}
