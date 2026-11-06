import streamlit as st
import random
import datetime

# Page Configuration
st.set_page_config(
    page_title="EventSchool - School Event Management System",
    page_icon="🎓",
    layout="wide"
)

# Initialize Session State Data
if "users" not in st.session_state:
    st.session_state.users = [
        {"id": 1, "name": "Admin User", "email": "admin@eventschool.edu", "pass": "AdminPass123!", "role": "admin"}
    ]

if "events" not in st.session_state:
    st.session_state.events = [
        {
            "id": 101,
            "title": "Annual Science Exhibition",
            "category": "Academic",
            "status": "Open for Registration",
            "date": "2026-11-15",
            "time": "10:00 AM",
            "venue": "Main Auditorium",
            "limit": 50,
            "registered": 2,
            "head": "Prof. Sharma",
            "img": "https://images.unsplash.com/photo-1564069114553-74243c4a6601?w=500",
            "desc": "Annual showcase of student science projects."
        },
        {
            "id": 102,
            "title": "Inter-School Football Tournament",
            "category": "Sports",
            "status": "Open for Registration",
            "date": "2026-11-20",
            "time": "09:00 AM",
            "venue": "Sports Ground",
            "limit": 100,
            "registered": 5,
            "head": "Coach Rajiv",
            "img": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500",
            "desc": "Football tournament for high school teams."
        }
    ]

if "regs" not in st.session_state:
    st.session_state.regs = []

if "current_user" not in st.session_state:
    st.session_state.current_user = None

# Custom CSS Styling (Orange & White Theme)
st.markdown("""
<style>
    :root {
        --primary: #ff6b00;
        --secondary: #2c3e50;
    }
    .stButton button {
        background-color: #ff6b00;
        color: white;
        border-radius: 8px;
        font-weight: 600;
        border: none;
    }
    .stButton button:hover {
        background-color: #e05e00;
        color: white;
    }
</style>
""", unsafe_allow_html=True)

# Top Bar Navigation / Auth status
st.sidebar.title("🎓 EventSchool")
user = st.session_state.current_user

if user:
    st.sidebar.success(f"Logged in as: **{user['name']}** ({user['role']})")
    if st.sidebar.button("Log out"):
        st.session_state.current_user = None
        st.rerun()
else:
    st.sidebar.info("Please log in or sign up.")
    auth_choice = st.sidebar.radio("Account", ["Log In", "Sign Up"])
    
    if auth_choice == "Log In":
        with st.sidebar.form("login_form"):
            email = st.text_input("Email")
            password = st.text_input("Password", type="password")
            submit = st.form_submit_button("Log In")
            if submit:
                found = next((u for u in st.session_state.users if u["email"] == email and u["pass"] == password), None)
                if found:
                    st.session_state.current_user = found
                    st.success("Logged in successfully!")
                    st.rerun()
                else:
                    st.error("Invalid credentials!")
                    
    elif auth_choice == "Sign Up":
        with st.sidebar.form("signup_form"):
            s_name = st.text_input("Full Name")
            s_email = st.text_input("Email")
            s_pass = st.text_input("Password", type="password")
            submit_s = st.form_submit_button("Sign Up")
            if submit_s:
                if any(u["email"] == s_email for u in st.session_state.users):
                    st.error("Email already registered!")
                else:
                    new_user = {"id": random.randint(1000, 9999), "name": s_name, "email": s_email, "pass": s_pass, "role": "student"}
                    st.session_state.users.append(new_user)
                    st.session_state.current_user = new_user
                    st.success("Account created successfully!")
                    st.rerun()

# Main Navigation Menu
menu = "Home & Events"
if user and user["role"] == "student":
    menu = st.sidebar.radio("Navigation", ["Home & Events", "My Registrations"])
elif user and user["role"] in ["admin", "head"]:
    menu = st.sidebar.radio("Navigation", ["Home & Events", "Management Dashboard"])

# 1. Home & Events Section
if menu == "Home & Events":
    st.title("Empowering School Events with Seamless Management")
    st.markdown("Discover, organize, and participate in academic, sports, and cultural events effortlessly.")
    
    st.divider()
    
    # Filters
    col1, col2, col3 = st.columns(3)
    with col1:
        search_query = st.text_input("🔍 Search Event", "")
    with col2:
        cat_filter = st.selectbox("Category", ["All", "Academic", "Cultural", "Sports", "Workshops"])
    with col3:
        status_filter = st.selectbox("Status", ["All", "Open for Registration", "Planning", "In Progress", "Completed"])
        
    st.subheader("Upcoming Events")
    
    # Filter logic
    filtered_events = []
    for ev in st.session_state.events:
        if search_query.lower() not in ev["title"].lower() and search_query.lower() not in ev["desc"].lower():
            continue
        if cat_filter != "All" and ev["category"] != cat_filter:
            continue
        if status_filter != "All" and ev["status"] != status_filter:
            continue
        filtered_events.append(ev)
        
    if not filtered_events:
        st.info("No events match your search criteria.")
    
    for ev in filtered_events:
        with st.container():
            col_img, col_info = st.columns([1, 2])
            with col_img:
                st.image(ev["img"], use_column_width=True)
            with col_info:
                st.markdown(f"### {ev['title']}")
                st.write(f"**Category:** {ev['category']} | **Status:** {ev['status']}")
                st.write(f"📅 **Date:** {ev['date']} @ {ev['venue']} | 👤 **Head:** {ev['head']}")
                st.write(ev['desc'])
                
                seats_left = ev["limit"] - ev["registered"]
                st.progress(ev["registered"] / ev["limit"], text=f"Seats left: {seats_left} of {ev['limit']}")
                
                if st.button(f"Register Now", key=f"reg_{ev['id']}"):
                    if not user:
                        st.warning("Please log in from the sidebar to register for events!")
                    else:
                        already_reg = any(r["eventId"] == ev["id"] and r["userEmail"] == user["email"] for r in st.session_state.regs)
                        if already_reg:
                            st.warning("You are already registered for this event!")
                        else:
                            ev["registered"] += 1
                            ticket = "TICK-" + str(random.randint(100000, 999999))
                            st.session_state.regs.append({
                                "id": random.randint(10000, 99999),
                                "eventId": ev["id"],
                                "eventTitle": ev["title"],
                                "userEmail": user["email"],
                                "userName": user["name"],
                                "status": "Pending",
                                "ticketCode": ticket
                            })
                            st.success("Registration submitted successfully! Status is Pending.")
                            st.rerun()
        st.divider()

# 2. My Registrations (Student view)
elif menu == "My Registrations" and user:
    st.title("My Event Registrations")
    user_regs = [r for r in st.session_state.regs if r["userEmail"] == user["email"]]
    
    if not user_regs:
        st.info("You haven't registered for any events yet.")
    else:
        for r in user_regs:
            col1, col2, col3 = st.columns([2, 1, 1])
            with col1:
                st.markdown(f"### {r['eventTitle']}")
                st.write(f"Status: **{r['status']}**")
            with col2:
                st.write(f"Ticket Code: `✨ {r['ticketCode']}`")
            with col3:
                if r['status'] == 'Approved':
                    st.success("Approved Ticket Ready!")
                else:
                    st.info("Waiting for Head Approval")
            st.divider()

# 3. Management Dashboard (Admin/Head view)
elif menu == "Management Dashboard" and user and user["role"] in ["admin", "head"]:
    st.title("Management Dashboard")
    
    tab1, tab2, tab3 = st.tabs(["📊 Overview", "📅 Manage Events", "👥 Participants"])
    
    with tab1:
        st.subheader("Overview Statistics")
        c1, c2 = st.columns(2)
        c1.metric("Total Events", len(st.session_state.events))
        c2.metric("Total Registrations", len(st.session_state.regs))
        
    with tab2:
        st.subheader("Event Management")
        if user["role"] == "admin":
            with st.form("create_event_form"):
                st.write("Create New Event")
                t_title = st.text_input("Event Title")
                t_cat = st.selectbox("Category", ["Academic", "Cultural", "Sports", "Workshops"])
                t_date = st.date_input("Event Date")
                t_venue = st.text_input("Venue")
                t_limit = st.number_input("Capacity Limit", min_value=1, value=50)
                t_desc = st.text_area("Description")
                sub_ev = st.form_submit_button("Save Event")
                if sub_ev:
                    st.session_state.events.append({
                        "id": random.randint(200, 999),
                        "title": t_title,
                        "category": t_cat,
                        "status": "Open for Registration",
                        "date": str(t_date),
                        "time": "10:00 AM",
                        "venue": t_venue,
                        "limit": t_limit,
                        "registered": 0,
                        "head": user["name"],
                        "img": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500",
                        "desc": t_desc
                    })
                    st.success("Event created successfully!")
                    st.rerun()
                    
        for e in st.session_state.events:
            st.write(f"**{e['title']}** ({e['category']}) - {e['registered']}/{e['limit']} seats filled")
            
    with tab3:
        st.subheader("Participant Approvals")
        if not st.session_state.regs:
            st.info("No participant registrations found.")
        for r in st.session_state.regs:
            cols = st.columns([2, 2, 1, 1])
            cols[0].write(f"**{r['userName']}**")
            cols[1].write(f"Event: {r['eventTitle']}")
            cols[2].write(f"Status: {r['status']}")
            with cols[3]:
                if r['status'] == 'Pending':
                    if st.button("Approve", key=f"app_{r['id']}"):
                        r['status'] = 'Approved'
                        st.rerun()
                    if st.button("Reject", key=f"rej_{r['id']}"):
                        r['status'] = 'Rejected'
                        st.rerun()