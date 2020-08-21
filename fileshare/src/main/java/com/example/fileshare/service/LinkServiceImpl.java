package com.example.fileshare.service;

import com.example.fileshare.model.File;
import com.example.fileshare.model.Link;
import com.example.fileshare.repository.LinkRepository;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class LinkServiceImpl implements LinkService {

    private final LinkRepository linkRepository;

    public LinkServiceImpl(LinkRepository linkRepository) {
        this.linkRepository = linkRepository;
    }

    @Override
    public Link getLinkByGeneratedName(String generatedName) {
        return linkRepository.findByGeneratedName(generatedName);
    }

    @Override
    public String save(File file) {
        Link link = new Link(file);
        link.setGeneratedName(generateUniqueName());
        linkRepository.save(link);
        return link.getGeneratedName();
    }

    @Override
    public void delete(String name) {
        Link link = linkRepository.findByGeneratedName(name);
        linkRepository.delete(link);

    }

    private String generateUniqueName() {
        int leftLimit = 48; // numeral '0'
        int rightLimit = 122; // letter 'z'
        int targetStringLength = 10;
        Random random = new Random();

        String generatedString = random.ints(leftLimit, rightLimit + 1)
                .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                .limit(targetStringLength)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();

        System.out.println(generatedString);

        return generatedString;

    }
}
