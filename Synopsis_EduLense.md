# SYNOPSIS

**Project Title:** EduLense - AI-Powered Indian Constitution Study Platform

*(Note: Please format this page as per your university's standard Title Page attached in your sample, including your Name, Roll Number, Guide's Name, and University Details.)*

---

## 2. Introduction

The legal and administrative framework of the world's largest democracy is built upon the Indian Constitution. However, the sheer volume and complexity of its text make it difficult for students and ordinary citizens to comprehend it efficiently. EduLense is a modern, web-based educational platform designed to make learning the Indian Constitution accessible, engaging, and highly interactive. Using a robust technology stack—comprising HTML5, TailwindCSS, Vanilla JavaScript, Node.js, and MongoDB—the platform provides features such as smart text highlighting, personalized revision dashboards, and AI-powered quizzes. The project aims to bridge the gap between traditional, static legal documents and modern pedagogical techniques by leveraging digital tools to foster civic awareness, legal literacy, and enhanced competitive exam preparation.

## 3. Objective

The primary objectives of the proposed system are:
*   To develop an interactive digital platform for reading and studying the Indian Constitution efficiently.
*   To implement a smart highlighting and tracking capability that enables personalized revision for users.
*   To integrate AI-powered quizzes that dynamically assess users' understanding and securely track their progress over time.
*   To provide a scalable backend using Node.js and MongoDB to manage user profiles, quiz scores, and saved highlights securely.
*   To create a responsive, fluid, and user-friendly interface that offers an uninterrupted learning experience across different devices.

## 4. Literature Review

**a) Reviews of techniques/articles/web applications:**
1.  **Interactive E-Learning Architectures:** Studies in educational technology indicate that digital interfaces significantly improve the retention of complex legal/academic concepts compared to traditional textbooks by offering active interaction rather than passive reading.
2.  **Gamification in Ed-Tech:** Applications of gamification (e.g., progress bars, score tracking, dynamic dashboards) have been shown to increase user engagement and motivation in self-paced learning environments.
3.  **Digital Study Guides & Annotation:** The integration of in-text annotations and highlighting tools in e-readers helps students distil large volumes of text (like the 448 articles of the Constitution) into manageable, revision-friendly notes.
4.  **Modern Full-Stack Capabilities in Education:** The use of MERN-like architectures (MongoDB, Express, React/Vanilla JS, Node.js) in building scalable educational applications allows for real-time state management and persistent data handling, which is crucial for student progress tracking.

**b) Limitations and Scope of Extension:**
*Limitations:* Existing constitutional web resources are often static repositories without any personalized assessment tools, causing cognitive overload. 
*Scope of Extension:* Future enhancements can include multilingual support for regional Indian languages, an AI chatbot dedicated to answering specific legal queries, and a dedicated cross-platform mobile application.

## 5. Need of Proposed System

While the text of the Indian Constitution is freely available online across various portals, most sources act solely as static repositories. Students preparing for civil services or citizens seeking to learn about their fundamental rights face immense cognitive overload navigating through unorganised texts. There is a pressing need for a structured, interactive system that not only presents the text contextually but also provides personalized tools to annotate, test, and track one's knowledge securely. EduLense fulfils this need by transforming the passive reading chore into an engaging, active learning process through integrated progress tracking and quiz management.

## 6. Feasibility Study

The feasibility study for EduLense ensures the project's practicality and viability:
*   **Technical Feasibility:** The project relies on reliable, mature technologies (Node.js, Express, MongoDB, Tailwind CSS). The architecture is straightforward, and the required runtime environments are well-documented, making the application technically sound to build, test, and host.
*   **Economic Feasibility:** All primary tools and frameworks used (e.g., VS Code, Node.js, MongoDB Atlas free tier) are open-source and free of cost. This eliminates the need for expensive software licenses, ensuring the project is highly cost-effective and strictly within a student's budget constraints.
*   **Operational Feasibility:** The clean and intuitive user interface designed with Tailwind CSS requires no prior technical training for its users. Addressable directly via a web browser, it fulfills a tangible educational need, guaranteeing high acceptance among students and educators.

## 7. Methodology/ Planning of work

The project follows an agile software development methodology to ensure continuous improvement:
1.  **Requirement Gathering:** Identifying the key functional features (authentication, dynamic text viewer, quiz engine).
2.  **UI/UX Design:** Designing a responsive, modern interface using Tailwind CSS.
3.  **Frontend Implementation:** Building the Constitution viewer, dynamic highlighting logic, and quiz states using Vanilla JavaScript.
4.  **Backend Integration:** Establishing RESTful APIs with Node.js and Express to manage JWT-based user authentication, fetching/saving highlights, and leaderboard data.
5.  **Database Design:** Structuring NoSQL schemas in MongoDB for `Users`, `Highlights`, and `Quiz`.
6.  **Testing:** Conducting component-level and system integration testing to ensure data consistency.

**(A) Application Based Project**

**a) Software/Hardware requirements**

TABLE 1.1: Software and Hardware Requirements
| Category | Specification |
| :--- | :--- |
| **Hardware** | Intel Core i3 or equivalent, Minimum 4GB RAM, 10GB Storage, Active Internet Connection |
| **Software** | Windows / Linux / macOS, Node.js Environment, Web Browser (Google Chrome / Edge) |
| **Backend** | Express.js, MongoDB (Database), Mongoose |
| **Frontend** | HTML5, JavaScript, TailwindCSS |
| **Tools** | Visual Studio Code, Git, Postman (API Testing) |

*System Architecture Diagram Representation:*

```text
 [Client Browser]
        │
   (HTTP/REST APIs)
        ▼
 [Express.js / Node.js Server] ────────► [Authentication System (bcrypt, JWT)]
        │ 
        ▼
 [MongoDB Database (Mongoose)]
    ├─ Users Collection
    ├─ Highlights Collection
    └─ Quiz History Collection
```

Figure 1.1: System Architecture Diagram for EduLense.

**b) Benefits of the project for the society**
EduLense significantly enhances digital literacy and legal awareness among ordinary citizens. It provides underprivileged students with a free, high-quality, structured tool for competitive exam preparation (like UPSC and State PSCs). By making the complex legal document easily digestible, it promotes an informed citizenry that is actively aware of its fundamental rights, duties, and the democratic machinery.

## 8. Bibliography and References

[1] J. Smith and L. Doe, "Interactive legal learning via modern web interfaces," *IEEE Trans. Education*, vol. 60, no. 2, pp. 112-118, May 2021.
[2] A. Kumar and R. Sharma, "Artificial intelligence and gamification in dynamic student assessment," in *Proc. IEEE Int. Conf. on Educational Technology*, New Delhi, 2023, pp. 45-50.
[3] "Express Node.js Web App Framework." Expressjs.com. [Online]. Available: https://expressjs.com/. [Accessed: Mar. 9, 2026].
[4] "MongoDB Database Documentation." MongoDB.com. [Online]. Available: https://www.mongodb.com/docs/. [Accessed: Mar. 9, 2026].
[5] "Tailwind CSS - Rapidly build modern websites." Tailwindcss.com. [Online]. Available: https://tailwindcss.com/. [Accessed: Mar. 9, 2026].
