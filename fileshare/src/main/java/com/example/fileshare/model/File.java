package com.example.fileshare.model;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.util.Objects;

@Entity
public class File {

    public File() {
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof File)) return false;
        File file = (File) o;
        return getId() == file.getId() &&
                isFolder() == file.isFolder() &&
                getName().equals(file.getName()) &&
                getAuthor().equals(file.getAuthor()) &&
                getParent().equals(file.getParent());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getName(), isFolder(), getAuthor(), getParent());
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int id;

    @Column
    public String name;

    @Column
    public boolean folder;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    public User author;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    public File parent;

    public File(String name, User author, File parent) {
        this.name = name;
        this.author = author;
        this.parent = parent;
        this.folder = true;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public File getParent() {
        return parent;
    }

    public void setParent(File parent) {
        this.parent = parent;
    }

    public User getAuthor() {
        return author;
    }

    public boolean isFolder() {
        return folder;
    }

    public void setFolder(boolean folder) {
        this.folder = folder;
    }
}
