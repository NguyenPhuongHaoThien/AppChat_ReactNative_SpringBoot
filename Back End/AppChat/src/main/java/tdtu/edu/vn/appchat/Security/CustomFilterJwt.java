package tdtu.edu.vn.appchat.Security;

import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import tdtu.edu.vn.appchat.Util.JwtUtilsHelper;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
@AllArgsConstructor
public class CustomFilterJwt extends OncePerRequestFilter {
    JwtUtilsHelper jwtUtilsHelper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = getTokenFromHeader(request);

        System.out.println("Token: " + token);

        if (token != null) {
            if (jwtUtilsHelper.verifyToken(token)) {
                System.out.println("Token kiemtra: " + token);

                String email = jwtUtilsHelper.getEmailFromToken(token);
                String role = jwtUtilsHelper.getRoleFromToken(token);
                String id = jwtUtilsHelper.getIdFromToken(token);
                if (id == null || id.isEmpty()) {
                    // Xử lý trường hợp id bị null hoặc rỗng
                    // Ví dụ, bạn có thể gán một giá trị mặc định hoặc ném một ngoại lệ
                    id = "default_id";
                }
                System.out.println("Email: " + email);
                System.out.println("Role: " + role);

                List<GrantedAuthority> authorities = new ArrayList<>();

                if (role != null && !role.isEmpty()) {
                    authorities.add(new SimpleGrantedAuthority(role));
                } else {
                    System.out.println("Role is null or empty, assigning default role 'USER'");
                    authorities.add(new SimpleGrantedAuthority("USER"));
                }


                UserPrincipal userPrincipal = new UserPrincipal(email, id);

                // Thêm userPrincipal vào UsernamePasswordAuthenticationToken
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userPrincipal, null, authorities);
                System.out.println(userPrincipal.getId());
                System.out.println(userPrincipal.getEmail());

                SecurityContext securityContext = SecurityContextHolder.getContext();


                securityContext.setAuthentication(usernamePasswordAuthenticationToken);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromHeader(HttpServletRequest request){
        String header = request.getHeader("Authorization");
        String token = null;

        if(StringUtils.hasText(header) && header.startsWith("Bearer ")){
            token = header.substring(7);
        }

        return token;
    }

    public class UserPrincipal {
        private String email;
        private String id;

        public UserPrincipal(String email, String id) {
            this.email = email;
            this.id = id;
        }

        // getters and setters
        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }
    }
}
