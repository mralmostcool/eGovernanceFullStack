package egov;

import org.springframework.boot.SpringApplication;

public class TestEgovApplication {

	public static void main(String[] args) {
		SpringApplication.from(EgovApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
