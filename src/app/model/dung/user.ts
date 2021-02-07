export interface User {
  id?: number;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  avatar?: string;
  detail?: string;
  createdDate?: string;
  blocked?: boolean;
  roles:any[];
}
// @Id
// @GeneratedValue(strategy = GenerationType.IDENTITY)
// private int id;
//
// private String username;
// private String password;
//
// private String firstName;
// private String lastName;
//
// private Timestamp dateOfBirth;
//
// private String gender;
//
// private String phone;
//
// private String email;
//
// private String address;
//
// private String avatar;
//
// @Column(columnDefinition = "TEXT")
// private String detail;
//
// private Timestamp createdDate;
//
// @JsonProperty
// private boolean blocked;
//
// @ManyToMany
// @JoinTable(
//   name = "users_roles",
//   joinColumns = {@JoinColumn(name="user_id")},
//   inverseJoinColumns = {@JoinColumn(name="role_id")}
// )
// private Set<Role> roles;
